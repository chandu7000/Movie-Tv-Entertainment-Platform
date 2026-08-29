const { successResponse } = require('../utils/apiResponse');
const { validateMediaItem } = require('../utils/validation');
const { listItems, addItem, removeItem, hasItem } = require('../services/libraryService');
const createLibraryController = (kind) => ({
  list: async (req,res,next) => { try { return successResponse(res,{ data:{ items: await listItems(req.user._id,kind,req.query) } }); } catch(error){ return next(error); } },
  add: async (req,res,next) => { try { const errors=validateMediaItem(req.body); if(Object.keys(errors).length) return res.status(400).json({success:false,message:'Validation failed.',data:{errors}}); const item=await addItem(req.user._id,kind,req.body); return successResponse(res,{status:201,message:`${kind==='watchlist'?'Watchlist':'Favorite'} updated.`,data:{item}}); } catch(error){ return next(error); } },
  remove: async (req,res,next) => { try { const item=await removeItem(req.user._id,kind,req.params.mediaType,req.params.tmdbId); if(!item) return res.status(404).json({success:false,message:'Saved item not found.',data:null}); return successResponse(res,{message:'Item removed.',data:{item}}); } catch(error){ return next(error); } },
  check: async (req,res,next) => { try { const exists=Boolean(await hasItem(req.user._id,kind,req.params.mediaType,req.params.tmdbId)); return successResponse(res,{data:{saved:exists}}); } catch(error){ return next(error); } },
});
module.exports = { createLibraryController };
